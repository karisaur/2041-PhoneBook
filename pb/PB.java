package pb;

import java.net.URLDecoder;
import java.util.*;
import java.sql.*;

public class PB {
	private String entry = "";
	private String message = "";
	private Map<String, String> parameters;

	public PB() throws Exception {
		this.getParameters();

		this.entry = parameters.get("entry");
		if (this.entry == null) {
			System.out.println("<br /><br />Search was empty!");
			return;
		}
		
		PBdao dao = new PBdao();
		ArrayList<PBrow> set = dao.find(this.entry);
		if (set.size() == 0) {
			System.out.println("<br /><br />No match found.");
			return;
		}
		
		for (int iter = 0, len = set.size(); iter < len; iter++) {
			this.serveDetailPage(set.get(iter));
		}
	}

	private void getParameters() throws Exception {
		this.parameters = new HashMap<String, String>();
		String method = System.getenv("REQUEST_METHOD");
		if (!method.equals("POST")) return;
		
		Scanner input = new Scanner(System.in);
		String queryString = input.nextLine();
		StringTokenizer queryTokens = new StringTokenizer(queryString, "&");
		while (queryTokens.hasMoreTokens()) {
			String[] queryPair = queryTokens.nextToken().split("=");
			String param = queryPair[0];
			String value = null;
			if (queryPair.length == 2) value = URLDecoder.decode(queryPair[1], "UTF-8");
			this.parameters.put(param, value);
		}
	}

	private void serveDetailPage(PBrow row) {
		if (row == null) return;
		System.out.println("<br /><br /><label for=\"lastname\">Last Name:</label><input id=\"lastname\" type=\"text\" readonly=\"readonly\" value=\"" + row.getLastName() + "\"><br>"
			+ "<label for=\"firstname\">First Name:</label><input id=\"firstname\" type=\"text\" readonly=\"readonly\" value=\"" + row.getFirstName() + "\"><br>"
			+ "<label for=\"telephone\">Telephone:</label><input id=\"telephone\" type=\"text\" readonly=\"readonly\" value=\"" + row.getTelephone() + "\"><br>");
	}
}
